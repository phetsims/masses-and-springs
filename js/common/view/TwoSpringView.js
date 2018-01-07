// Copyright 2016-2018, University of Colorado Boulder

/**
 * Common ScreenView for  using two masses.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var GravityAndDampingControlPanel = require( 'MASSES_AND_SPRINGS/common/view/GravityAndDampingControlPanel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MovableLineNode = require( 'MASSES_AND_SPRINGS/common/view/MovableLineNode' );
  var ReferenceLineNode = require( 'MASSES_AND_SPRINGS/common/view/ReferenceLineNode' );
  var SpringHangerNode = require( 'MASSES_AND_SPRINGS/common/view/SpringHangerNode' );
  var SpringView = require( 'MASSES_AND_SPRINGS/common/view/SpringView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ToolboxPanel = require( 'MASSES_AND_SPRINGS/common/view/ToolboxPanel' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var EQUILIBRIUM_LINE_FILL = 'rgb( 93, 191, 142 )';
  var NATURAL_LENGTH_LINE_FILL = 'rgb( 65, 66, 232 )';

  // strings
  var largeString = require( 'string!MASSES_AND_SPRINGS/large' );
  var smallString = require( 'string!MASSES_AND_SPRINGS/small' );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function TwoSpringView( model, tandem ) {
    this.model = model; // Make model available
    SpringView.call( this, model, tandem, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );
    var self = this;

    model.springs[ 0 ].options.modelViewTransform2 = this.modelViewTransform;
    model.springs[ 1 ].options.modelViewTransform2 = this.modelViewTransform;

    // Spring Hanger Node
    this.springHangerNode = new SpringHangerNode(
      model.springs,
      this.modelViewTransform,
      tandem.createTandem( 'springHangerNode' )
    );

    this.firstSpringStopperButtonNode = this.createStopperButton( this.model.springs[ 0 ], tandem );
    this.firstSpringStopperButtonNode.right = this.springHangerNode.left - this.spacing;

    this.secondSpringStopperButtonNode = this.createStopperButton( this.model.springs[ 1 ], tandem );
    this.secondSpringStopperButtonNode.left = this.springHangerNode.right + this.spacing;

    // Spring Constant Control Panels
    var minMaxLabels = [
      new Text( smallString, { font: MassesAndSpringsConstants.LABEL_FONT } ),
      new Text( largeString, { font: MassesAndSpringsConstants.LABEL_FONT } )
    ];
    this.firstSpringConstantControlPanel = this.createSpringConstantPanel( 0, minMaxLabels, tandem );
    this.firstSpringConstantControlPanel.right = this.springHangerNode.left - 40;

    this.secondSpringConstantControlPanel = this.createSpringConstantPanel( 1, minMaxLabels, tandem );
    this.secondSpringConstantControlPanel.left = this.secondSpringStopperButtonNode.right + this.spacing;

    // Initializes red movable reference line
    var movableLineNode = new MovableLineNode(
      this.visibleBoundsProperty.get().getCenter().minus( new Vector2( 45, 0 ) ),
      180,
      model.movableLineVisibleProperty,
      this.springHangerNode.centerX + 5,
      tandem.createTandem( 'movableLineNode' )
    );

    // @public Initializes equilibrium line for first spring
    var firstSpringEquilibriumLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.springs[ 0 ],
      model.springs[ 0 ].equilibriumYPositionProperty,
      model.equilibriumPositionVisibleProperty, {
        stroke: EQUILIBRIUM_LINE_FILL
      }
    );

    // @public Initializes equilibrium line for second spring
    var secondSpringEquilibriumLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.springs[ 1 ],
      model.springs[ 1 ].equilibriumYPositionProperty,
      model.equilibriumPositionVisibleProperty, {
        stroke: EQUILIBRIUM_LINE_FILL
      }
    );

    // @public Initializes natural line for first spring
    var firstNaturalLengthLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.springs[ 0 ],
      model.springs[ 0 ].bottomProperty,
      model.naturalLengthVisibleProperty, {
        stroke: NATURAL_LENGTH_LINE_FILL,
        fixedPosition: true
      }
    );

    // @public Initializes natural line for second spring
    var secondNaturalLengthLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.springs[ 1 ],
      model.springs[ 1 ].bottomProperty,
      model.naturalLengthVisibleProperty, {
        stroke: NATURAL_LENGTH_LINE_FILL,
        fixedPosition: true
      }
    );

    // Gravity Control Panel
    this.gravityAndDampingControlPanel = new GravityAndDampingControlPanel(
      model, this, tandem.createTandem( 'gravityAndDampingControlPanel' ),
      {
        right: this.rightPanelAlignment,
        minWidth: 1,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        dampingVisible: false
      }
    );

    // Toolbox Panel
    this.toolboxPanel = new ToolboxPanel(
      this.visibleBoundsProperty.get(),
      this.rulerNode, this.timerNode,
      model.rulerVisibleProperty,
      model.timerVisibleProperty,
      tandem.createTandem( 'toolboxPanel' ),
      {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        xMargin: 0,
        yMargin: 0,
        stroke: MassesAndSpringsConstants.PANEL_FILL
      }
    );

    // Done to for movableDragHandler handling intersecting bounds of panel and ruler
    this.rulerNode.toolbox = this.toolboxPanel;
    this.timerNode.toolbox = this.toolboxPanel;

    this.springHangerNode.centerX = 336;

    // Adding all of the nodes to the scene graph
    this.addChild( this.springHangerNode );

    // Adding Panels to scene graph
    this.addChild( this.firstSpringConstantControlPanel );
    this.addChild( this.secondSpringConstantControlPanel );

    // Adding Buttons to scene graph
    this.addChild( this.resetAllButton );
    this.addChild( this.timeControlPanel );
    this.addChild( this.firstSpringStopperButtonNode );
    this.addChild( this.secondSpringStopperButtonNode );

    //Reference lines from indicator visibility box
    this.addChild( firstSpringEquilibriumLineNode );
    this.addChild( secondSpringEquilibriumLineNode );
    this.addChild( firstNaturalLengthLineNode );
    this.addChild( secondNaturalLengthLineNode );
    this.addChild( movableLineNode );
    this.addChild( this.massLayer );

    // Adding Nodes in tool box
    this.addChild( this.timerNode );
    this.addChild( this.rulerNode );

    // Adjust the floating panels to the visibleBounds of the screen.
    this.visibleBoundsProperty.link( function( visibleBounds ) {

      //Update the bounds of view elements
      self.gravityAndDampingControlPanel.right = visibleBounds.right - self.spacing;
      self.toolboxPanel.right = visibleBounds.right - self.spacing;
      self.resetAllButton.right = visibleBounds.right - self.spacing;
      self.timeControlPanel.right = self.resetAllButton.left - self.spacing * 6;
      self.toolboxPanel.dragBounds = 3;
      self.timerNode.updateBounds( visibleBounds.withOffsets(
        self.timerNode.width / 2, self.timerNode.height / 2, -self.timerNode.width / 2, -self.timerNode.height / 2
      ) );
      self.rulerNode.updateBounds( visibleBounds.withOffsets(
        -self.rulerNode.width / 2, self.rulerNode.height / 2, self.rulerNode.width / 2, -self.rulerNode.height / 2
      ) );
      self.massNodes.forEach( function( massNode ) {
        if ( massNode.centerX > visibleBounds.maxX ) {
          massNode.mass.positionProperty.set(
            new Vector2( self.modelViewTransform.viewToModelX( visibleBounds.maxX ), massNode.mass.positionProperty.get().y )
          );
        }
        if ( massNode.centerX < visibleBounds.minX ) {
          massNode.mass.positionProperty.set(
            new Vector2( self.modelViewTransform.viewToModelX( visibleBounds.minX ), massNode.mass.positionProperty.get().y )
          );
        }
      } );
    } );
  }

  massesAndSprings.register( 'TwoSpringView', TwoSpringView );

  return inherit( SpringView, TwoSpringView );
} );