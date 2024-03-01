// Copyright 2017-2023, University of Colorado Boulder

/**
 * Common ScreenView used for both singular and multispring screen view.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import { AlignBox, AlignGroup, HBox, Node, PaintColorProperty, Plane } from '../../../../scenery/js/imports.js';
import ClosestDragForwardingListener from '../../../../sun/js/ClosestDragForwardingListener.js';
import MutableOptionsNode from '../../../../sun/js/MutableOptionsNode.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsStrings from '../../MassesAndSpringsStrings.js';
import IndicatorVisibilityControlNode from '../../vectors/view/IndicatorVisibilityControlNode.js';
import MassesAndSpringsConstants from '../MassesAndSpringsConstants.js';
import DraggableRulerNode from './DraggableRulerNode.js';
import GravityAndDampingControlNode from './GravityAndDampingControlNode.js';
import MassNode from './MassNode.js';
import OscillatingSpringNode from './OscillatingSpringNode.js';
import ShelfNode from './ShelfNode.js';
import SpringControlPanel from './SpringControlPanel.js';
import StopperButtonNode from './StopperButtonNode.js';
import ToolboxPanel from './ToolboxPanel.js';

const springConstantPatternString = MassesAndSpringsStrings.springConstantPattern;
const springStrengthString = MassesAndSpringsStrings.springStrength;

class SpringScreenView extends ScreenView {
  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, tandem, options ) {
    super();

    options = merge( {
      useSliderLabels: true,
      dampingVisible: false
    }, options );

    // @public {Plane} Support for expanding touchAreas near massNodes.
    this.backgroundDragPlane = new Plane();
    const closestDragForwardingListener = new ClosestDragForwardingListener( 30, 0 );

    this.backgroundDragPlane.addInputListener( closestDragForwardingListener );


    // @public {MassesAndSpringsModel}
    this.model = model;

    const viewOrigin = new Vector2( 0, this.visibleBoundsProperty.get().height * ( 1 - MassesAndSpringsConstants.SHELF_HEIGHT ) );

    // @public {ModelViewTransform2}
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( Vector2.ZERO, viewOrigin, 397 );

    // @public {PaintColorProperty} Colors for OscillatingSpringNode
    this.springFrontColorProperty = new PaintColorProperty( 'lightGray' );
    this.springMiddleColorProperty = new PaintColorProperty( 'gray' );
    this.springBackColorProperty = new PaintColorProperty( 'black' );

    // @private {Array.<MutableOptionsNode>} Used to reference the created springs in the view.
    this.springNodes = model.springs.map( spring => {
      const springNode = new MutableOptionsNode( OscillatingSpringNode, [
          spring,
          this.modelViewTransform,

          // see https://github.com/phetsims/masses-and-springs-basics/issues/67
          Tandem.OPT_OUT
        ],
        { leftEndLength: -10 },
        {
          frontColor: this.springFrontColorProperty,
          middleColor: this.springMiddleColorProperty,
          backColor: this.springBackColorProperty
        } );
      this.addChild( springNode );
      return springNode;
    } );

    // @protected {number} - Spacing used for the margin of layout bounds
    this.spacing = 10;

    // @public {Node} Specific layer for massNodes. Used for setting layering order of massNodes.
    this.massLayer = new Node( { tandem: tandem.createTandem( 'massLayer' ), preventFit: true } );

    // @public {Array.<Node>}
    this.massNodes = [];

    this.massNodes = model.masses.map( mass => {
      const massNode = new MassNode(
        mass,
        this.modelViewTransform,
        this.visibleBoundsProperty,
        model,
        tandem.createTandem( `${mass.massTandem.name}Node` ) );
      this.massLayer.addChild( massNode );

      // If the mass is on the shelf reset the mass layers.
      mass.onShelfProperty.lazyLink( onShelf => {
        if ( onShelf ) {
          this.resetMassLayer();
        }
      } );
      closestDragForwardingListener.addDraggableItem( {
        startDrag: massNode.dragListener._start.bind( massNode.dragListener ),

        // globalPoint is the position of our pointer.
        computeDistance: globalPoint => {

          // The mass position is recognized as being really far away.
          if ( mass.userControlledProperty.value ) {
            return Number.POSITIVE_INFINITY;
          }
          else {
            const cursorViewPosition = this.globalToLocalPoint( globalPoint );
            const massRectBounds = massNode.localToParentBounds( massNode.rect.bounds );
            const massHookBounds = massNode.localToParentBounds( massNode.hookNode.bounds );

            return Math.sqrt( Math.min(
              massRectBounds.minimumDistanceToPointSquared( cursorViewPosition ),
              massHookBounds.minimumDistanceToPointSquared( cursorViewPosition )
            ) );
          }
        }
      } );


      // Keeps track of the mass node to restore original Z order.
      return massNode;
    } );

    // @public {Shelf} Add shelf for to house massNodes
    this.shelf = new ShelfNode( tandem, {
      rectHeight: 7
    } );
    this.shelf.rectY = this.modelViewTransform.modelToViewY( MassesAndSpringsConstants.FLOOR_Y ) - this.shelf.rectHeight;

    if ( !model.basicsVersion ) {
      this.addChild( this.shelf );
    }

    // @public {GravityAndDampingControlNode} Gravity Control Panel
    this.gravityAndDampingControlNode = new GravityAndDampingControlNode(
      model, this, tandem.createTandem( 'gravityAndDampingControlNode' ), {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH + 25,
        dampingVisible: options.dampingVisible,
        xMargin: 0,
        yMargin: 0,
        stroke: null,
        useSliderLabels: options.useSliderLabels
      } );

    // @private
    this.stopwatchNode = new StopwatchNode( model.stopwatch, {
      dragBoundsProperty: this.visibleBoundsProperty,
      dragListenerOptions: {
        end: () => {

          // When a node is released, check if it is over the toolbox.  If so, drop it in.
          if ( this.toolboxPanel.getGlobalBounds().intersectsBounds( this.stopwatchNode.getGlobalBounds() ) ) {
            model.stopwatch.reset();
          }
        }
      },
      tandem: tandem.createTandem( 'stopwatchNode' )
    } );

    // @public {DraggableRulerNode}
    this.rulerNode = new DraggableRulerNode(
      this.modelViewTransform,
      this.visibleBoundsProperty.get(),
      Vector2.ZERO,
      model.rulerVisibleProperty,
      () => {

        // When a node is released, check if it is over the toolbox.  If so, drop it in.
        if ( this.toolboxPanel.getGlobalBounds().intersectsBounds( this.rulerNode.getGlobalBounds() ) ) {
          model.rulerVisibleProperty.set( false );
        }
      },
      tandem.createTandem( 'rulerNode' )
    );

    // @public {Node} Create specific layer for tools so they don't overlap the reset all button.
    this.toolsLayer = new Node( {
      children: [ this.stopwatchNode, this.rulerNode ],
      tandem: tandem.createTandem( 'massLayer' ),
      preventFit: true
    } );

    // @public {ResetAllButton} Reset All button
    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();

        // Done to preserve layering order to initial state. Prevents masses from stacking over each other.
        this.resetMassLayer();
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // @public {TimeControlNode} Sim speed controls
    this.timeControlNode = new TimeControlNode( model.playingProperty, {
      timeSpeedProperty: model.timeSpeedProperty,
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
          listener: () => { model.stepForward( 0.01 ); }
        }
      },
      tandem: tandem.createTandem( 'timeControlNode' )
    } );

    // @public {AlignGroup}
    this.rightPanelAlignGroup = new AlignGroup( { matchVertical: false } );

    // @public {ToolboxPanel} Toolbox Panel
    this.toolboxPanel = new ToolboxPanel(
      model.stopwatch,
      this.visibleBoundsProperty.get(),
      this.rulerNode,
      this.stopwatchNode,
      model.rulerVisibleProperty,
      this.rightPanelAlignGroup,
      tandem.createTandem( 'toolboxPanel' ), {
        minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH + 32
      }
    );

    // @public {HBox} Buttons controlling the speed of the sim, play/pause button, and the reset button
    this.simControlHBox = new HBox( {
      spacing: this.spacing * 6,
      children: [ this.timeControlNode, this.resetAllButton ]
    } );
    this.addChild( this.simControlHBox );

    // @protected {Node} Layer that gets moved to the back of the scene graph to handle z-ordering of subtypes.
    this.backLayer = new Node();
    this.addChild( this.backLayer );
    this.backLayer.moveToBack();
  }

  /**
   * Helper function to restore initial layering of the masses to prevent them from stacking over each other.
   * @public
   */
  resetMassLayer() {
    this.massNodes.forEach( massNode => {
      massNode.moveToFront();
    } );
  }

  /**
   * Creates a stopper button that stops the oscillation of its referenced spring.
   * @public
   *
   * @param {Spring} spring
   * @param {Tandem} tandem
   * @returns {StopperButtonNode}
   */
  createStopperButton( spring, tandem ) {
    return new StopperButtonNode(
      tandem.createTandem( 'secondSpringStopperButtonNode' ), {
        listener: () => {
          spring.stopSpring();
        },
        top: this.spacing
      } );
  }

  /**
   * Creates a panel that controls the designated spring's spring constant value.
   * @public
   *
   * @param {number} springIndex
   * @param {Array.<Text>} labels
   * @param {Tandem} tandem
   * @param {Object} [options]
   *
   * @returns {SpringControlPanel}
   */
  createSpringConstantPanel( springIndex, labels, tandem, options ) {

    // Additional options for compatibility with Masses and Springs: Basics
    options = merge( {
      string: this.model.basicsVersion ? springStrengthString : springConstantPatternString,
      sliderTrackSize: this.model.basicsVersion ? new Dimension2( 140, 0.1 ) : new Dimension2( 120, 0.1 ),
      yMargin: this.model.basicsVersion ? 7 : 5,
      spacing: this.model.basicsVersion ? 5 : 3,
      tickLabelSpacing: this.model.basicsVersion ? 7 : 6
    }, options );

    return new SpringControlPanel(
      this.model.springs[ springIndex ].springConstantProperty,
      MassesAndSpringsConstants.SPRING_CONSTANT_RANGE,
      StringUtils.fillIn( options.string, { spring: springIndex + 1, maxWidth: 40 } ),
      labels,
      tandem.createTandem( 'firstSpringConstantControlPanel' ),
      {
        top: this.spacing,
        visible: true,
        fill: 'white',
        stroke: 'gray',
        spacing: options.spacing,
        yMargin: options.yMargin,
        sliderTrackSize: options.sliderTrackSize,
        tickLabelSpacing: options.tickLabelSpacing,
        constrainValue: value => +Utils.toFixed( value, 0 )
      }
    );
  }

  /**
   * Creates a panel that displays visible indicators for reference lines, displacement arrow, and period trace.
   * @public
   *
   * @param {MassesAndSpringsModel} model
   * @param {Boolean} displayPeriodTrace
   * @param {Tandem} tandem
   * @returns {IndicatorVisibilityControlNode}
   */
  createIndicatorVisibilityPanel( model, displayPeriodTrace, tandem ) {
    return new IndicatorVisibilityControlNode(
      model,
      tandem.createTandem( 'indicatorVisibilityControlNode' ), {
        periodTraceOption: displayPeriodTrace
      } );
  }

  /**
   * Creates a panel that displays all of the right hand panels on the screen.
   * @public
   *
   * @param {Node} optionsContent
   * @param {AlignGroup} alignGroup
   * @param {Tandem } tandem
   * @returns {Panel}
   */
  createOptionsPanel( optionsContent, alignGroup, tandem ) {
    const optionsContentAlignBox = new AlignBox( optionsContent, { group: alignGroup } );
    const optionsPanel = new Panel(
      optionsContentAlignBox, {
        xMargin: 10,
        fill: MassesAndSpringsConstants.PANEL_FILL,
        align: 'center',
        cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
        tandem: tandem.createTandem( 'optionsPanel' ),
        minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH + 30
      } );
    optionsPanel.moveToBack();
    return optionsPanel;
  }

  /**
   * Adjusting view components of panels and draggable objects based on visible bounds of the
   * one and two spring views.
   *
   * @param {Boolean} singleSpringView
   * @param {Bounds2} visibleBounds
   * @public
   */
  adjustViewComponents( singleSpringView, visibleBounds ) {

    // Handle adjustments for single spring system
    if ( singleSpringView ) {
      this.panelRightSpacing = visibleBounds.right - this.spacing;

      // Alignment of layout
      this.springSystemControlsNode.centerX = this.springCenter * 0.855; // centering springHangerNode over spring
      this.springSystemControlsNode.top = this.spacing;
      this.springConstantControlPanel.top = this.springSystemControlsNode.top;
      this.springConstantControlPanel.left = this.springSystemControlsNode.right + this.spacing;
      this.springSystemControlsNode.top = this.spacing;
      this.simControlHBox.rightBottom = new Vector2( this.panelRightSpacing, this.shelf.bottom );
      this.movableLineNode.centerX = this.springCenter;

      if ( !this.model.basicsVersion ) {
        this.energyGraphAccordionBox.leftTop = new Vector2( visibleBounds.left + this.spacing, this.springSystemControlsNode.top );
      }
    }

    // Handle adjustments for two spring system
    else {

      // {number} Used in determining springSystemControlsNode's placement
      const distanceBetweenSprings = ( this.modelViewTransform.modelToViewX(
        this.model.firstSpring.positionProperty.value.distance( this.model.secondSpring.positionProperty.value ) ) / 2 );
      const leftSpringXPosition = this.modelViewTransform.modelToViewX( this.model.firstSpring.positionProperty.value.x );

      // Update the bounds of view elements
      this.panelRightSpacing = visibleBounds.right - this.spacing;

      // Alignment of layout
      this.springSystemControlsNode.x = leftSpringXPosition + distanceBetweenSprings - this.springHangerNode.centerX;
      this.springSystemControlsNode.top = this.spacing;
      this.simControlHBox.rightBottom = new Vector2( this.panelRightSpacing, this.shelf.bottom );

    }

    // Adjusting drag bounds of draggable objects based on visible bounds.
    this.rulerNode.rulerNodeDragListener.dragBoundsProperty = visibleBounds.withOffsets(
      -this.rulerNode.width / 2, this.rulerNode.height / 2, this.rulerNode.width / 2, -this.rulerNode.height / 2
    );
    this.massNodes.forEach( function( massNode ) {
      if ( massNode.centerX > visibleBounds.maxX ) {
        massNode.mass.positionProperty.set(
          new Vector2(
            this.modelViewTransform.viewToModelX( visibleBounds.maxX ),
            massNode.mass.positionProperty.get().y
          )
        );
      }
      if ( massNode.centerX < visibleBounds.minX ) {
        massNode.mass.positionProperty.set(
          new Vector2(
            this.modelViewTransform.viewToModelX( visibleBounds.minX ),
            massNode.mass.positionProperty.get().y
          )
        );
      }
    } );
  }
}

massesAndSprings.register( 'SpringScreenView', SpringScreenView );
export default SpringScreenView;