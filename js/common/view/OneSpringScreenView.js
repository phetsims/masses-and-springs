// Copyright 2016-2022, University of Colorado Boulder

/**
 * Common ScreenView for using one mass.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { HBox, Text } from '../../../../scenery/js/imports.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsStrings from '../../MassesAndSpringsStrings.js';
import DisplacementArrowNode from '../../vectors/view/DisplacementArrowNode.js';
import MassesAndSpringsConstants from '../MassesAndSpringsConstants.js';
import Mass from '../model/Mass.js';
import EnergyGraphAccordionBox from './EnergyGraphAccordionBox.js';
import MassesAndSpringsColors from './MassesAndSpringsColors.js';
import MassNode from './MassNode.js';
import MassValueControlPanel from './MassValueControlPanel.js';
import MovableLineNode from './MovableLineNode.js';
import ReferenceLineNode from './ReferenceLineNode.js';
import SpringHangerNode from './SpringHangerNode.js';
import SpringScreenView from './SpringScreenView.js';

const heightEqualsZeroString = MassesAndSpringsStrings.heightEqualsZero;
const largeString = MassesAndSpringsStrings.large;
const smallString = MassesAndSpringsStrings.small;

class OneSpringScreenView extends SpringScreenView {

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, tandem, options ) {
    super( model, tandem, options );
    // @public {number} centerX of the spring in view coordinates
    this.springCenter = this.modelViewTransform.modelToViewX( model.firstSpring.positionProperty.value.x );

    // Spring Constant Control Panel
    const minMaxLabels = [
      new Text( smallString, { font: MassesAndSpringsConstants.LABEL_FONT, maxWidth: 60 } ),
      new Text( largeString, { font: MassesAndSpringsConstants.LABEL_FONT, maxWidth: 60 } )
    ];

    // @public {Property.<boolean>} Equilibrium of mass is dependent on the mass being attached and the visibility of the equilibrium line.
    this.equilibriumVisibilityProperty = new DerivedProperty(
      [ model.equilibriumPositionVisibleProperty, model.firstSpring.massAttachedProperty ],
      ( equilibriumPositionVisible, massAttached ) => {
        if ( massAttached ) {
          return equilibriumPositionVisible;
        }
        else {
          return false;
        }
      } );

    // @public {MassNode} Icon used in massValueControlPanel in both Basics and non-Basics version
    this.massNodeIcon = new MassNode(
      new Mass( 0.0055, 0, MassesAndSpringsColors.adjustableMassProperty, model.gravityProperty, tandem, { icon: true } ),
      this.modelViewTransform,
      this.visibleBoundsProperty,
      model,
      tandem.createTandem( 'massIcon' ) );

    const massValueControlPanel = new MassValueControlPanel(
      model.masses[ 0 ],
      this.massNodeIcon,
      tandem.createTandem( 'massValueControlPanel' ), {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH - 8,
        yMargin: 5
      } );

    this.springHangerNode = new SpringHangerNode( model.springs,
      this.modelViewTransform,
      tandem.createTandem( 'springHangerNode' ),
      {
        singleSpring: true
      } );
    this.springStopperButtonNode = this.createStopperButton( this.model.firstSpring, tandem );

    // @public {SpringControlPanel} Accessed in Basics version
    this.springConstantControlPanel = this.createSpringConstantPanel( 0, minMaxLabels, tandem );

    // @public {ReferenceLineNode} Initializes equilibrium line for an attached mass
    this.massEquilibriumLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.firstSpring,
      model.firstSpring.massEquilibriumYPositionProperty,
      this.equilibriumVisibilityProperty, {
        stroke: 'black'
      }
    );

    // Initializes natural line for the spring
    const naturalLengthLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.firstSpring,
      model.firstSpring.bottomProperty,
      model.naturalLengthVisibleProperty, {
        stroke: MassesAndSpringsColors.unstretchedLengthProperty, // Naming convention pulled from basics version.
        fixedPosition: true
      }
    );

    this.model.firstSpring.buttonEnabledProperty.link(
      buttonEnabled => {
        this.springStopperButtonNode.enabled = buttonEnabled;
      } );

    if ( !model.basicsVersion ) {
      // @public {EnergyGraphAccordionBox} energy graph that displays energy values for the spring system.
      this.energyGraphAccordionBox = new EnergyGraphAccordionBox( model, tandem );
      this.addChild( this.energyGraphAccordionBox );
    }

    // Property that determines the zero height in the view.
    const zeroHeightProperty = new Property( this.modelViewTransform.modelToViewY( MassesAndSpringsConstants.FLOOR_Y ) );

    // Initializes movable line
    const xBoundsLimit = this.springCenter + this.spacing * 1.1;
    this.movableLineNode = new MovableLineNode(
      this.springHangerNode.center.plus( new Vector2( 45, 200 ) ),
      100,
      model.movableLineVisibleProperty,
      new Bounds2( xBoundsLimit, 85, xBoundsLimit, zeroHeightProperty.value ),
      tandem.createTandem( 'movableLineNode' )
    );

    let displacementArrowNode;

    // Masses and Springs:Basics should not include a zero height reference line
    if ( !model.basicsVersion ) {

      // Displacement arrows added for each springs
      displacementArrowNode = new DisplacementArrowNode(
        this.springNodes[ 0 ].nodeProperty.value.spring.displacementProperty,
        model.naturalLengthVisibleProperty,
        tandem,
        {
          modelViewTransform: this.modelViewTransform,
          left: this.springNodes[ 0 ].nodeProperty.value.right + 12,
          centerY: this.modelViewTransform.modelToViewY( this.springNodes[ 0 ].nodeProperty.value.spring.bottomProperty.value )
        } );

      // Zero height reference line
      const zeroHeightLine = new ReferenceLineNode(
        this.modelViewTransform,
        model.firstSpring,
        zeroHeightProperty,
        new Property( true ), {
          stroke: '#5798de',
          zeroPointLine: true,
          label: new Text( heightEqualsZeroString, {
            font: MassesAndSpringsConstants.TITLE_FONT,
            fill: '#5798de',
            maxWidth: 125
          } )
        } );

      zeroHeightLine.x = this.massEquilibriumLineNode.x;
      zeroHeightLine.y = zeroHeightProperty.get();
      this.addChild( zeroHeightLine );

      this.resetAllButton.addListener( () => {
        this.movableLineNode.reset();
        this.energyGraphAccordionBox && this.energyGraphAccordionBox.reset();
      } );
    }

    // @public {HBox} Contains Panels/Nodes that hover near the spring system at the center of the screen.
    this.springSystemControlsNode = new HBox( {
      children: [
        massValueControlPanel,
        this.springHangerNode,
        this.springStopperButtonNode
      ],
      spacing: this.spacing * 1.4,
      align: 'top',
      excludeInvisibleChildrenFromBounds: false
    } );

    // Adding system controls and energy graph to scene graph
    this.addChild( this.springSystemControlsNode );
    this.addChild( this.springConstantControlPanel );

    // Reference lines from indicator visibility box
    if ( !model.basicsVersion ) {
      this.addChild( this.massEquilibriumLineNode );
    }

    this.addChild( naturalLengthLineNode );

    // This is handled here to maintain line node layering order
    if ( !model.basicsVersion ) {
      this.addChild( displacementArrowNode );
    }
    this.addChild( this.movableLineNode );

    // Adding layers for draggable objects
    this.addChild( this.massLayer );
    this.addChild( this.toolsLayer );

    // Adjust the floating panels to the visibleBounds of the screen.
    this.visibleBoundsProperty.link( visibleBounds => {
      this.adjustViewComponents( true, visibleBounds );
    } );
  }

  /**
   * Responsible for updating the energy bar graph
   *
   * @public
   */
  step() {
    this.energyGraphAccordionBox.update();
  }
}

massesAndSprings.register( 'OneSpringScreenView', OneSpringScreenView );
export default OneSpringScreenView;