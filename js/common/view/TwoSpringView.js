// Copyright 2017, University of Colorado Boulder

/**
 * Common ScreenView for  using two masses.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var EquilibriumLineNode = require( 'MASSES_AND_SPRINGS/common/view/EquilibriumLineNode' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MovableLineNode = require( 'MASSES_AND_SPRINGS/common/view/MovableLineNode' );
  var NaturalLengthLineNode = require( 'MASSES_AND_SPRINGS/common/view/NaturalLengthLineNode' );
  var SpringView = require( 'MASSES_AND_SPRINGS/common/view/SpringView' );
  var SpringHangerNode = require( 'MASSES_AND_SPRINGS/common/view/SpringHangerNode' );
  var SpringConstantControlPanel = require( 'MASSES_AND_SPRINGS/common/view/SpringConstantControlPanel' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var springConstantString = require( 'string!MASSES_AND_SPRINGS/springConstant' );

  /**
   * TODO::: Remove modelViewTransform2 transforms from view objects
   * TODO::: Factor out colors to a Constants object
   * TODO::: Factor out thumb size, track size, etc other slider properties
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function TwoSpringView( model, tandem ) {
    this.model = model; // Make model available for reset
    SpringView.call( this, model, tandem, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );
    var self = this;

    model.springs[ 0 ].options.modelViewTransform2 = this.modelViewTransform;
    model.springs[ 1 ].options.modelViewTransform2 = this.modelViewTransform;

    //  TODO: put in a vbox?? hmm... wrong place for this comment??
    // Spring Hanger Node
    this.springHangerNode = new SpringHangerNode(
      model.springs,
      this.modelViewTransform,
      tandem.createTandem( 'springHangerNode' )
    );

    // TODO: Crate in an array like in line 55-65 of SpringView.js. Position in each deescendent class.
    this.firstSpringStopperButtonNode = this.createStopperButton( this.model.springs[ 0 ], tandem );
    this.firstSpringStopperButtonNode.right = this.springHangerNode.left - this.spacing;

    var secondSpringStopperButtonNode = this.createStopperButton( this.model.springs[ 1 ], tandem );
    secondSpringStopperButtonNode.left = this.springHangerNode.right + this.spacing;


    // Spring Constant Control Panels
    this.firstSpringConstantControlPanel = this.createSpringConstantPanel( 0, tandem );
    this.firstSpringConstantControlPanel.right = this.springHangerNode.left - 40;


    this.secondSpringConstantControlPanel = this.createSpringConstantPanel( 1, tandem );
    this.secondSpringConstantControlPanel.left = secondSpringStopperButtonNode.right + this.spacing;


    // Initializes red movable reference line
    var movableLineNode = new MovableLineNode(
      this.visibleBoundsProperty.get().getCenter().minus( new Vector2( 45, 0 ) ),
      180,
      model.movableLineVisibleProperty,
      this.springHangerNode.centerX + 5,
      tandem.createTandem( 'movableLineNode' )
    );

    // @public Initializes equilibrium line for first spring
    var firstSpringEquilibriumLineNode = new EquilibriumLineNode(
      this.modelViewTransform,
      model.springs[ 0 ],
      model.equilibriumPositionVisibleProperty,
      tandem.createTandem( 'firstSpringEquilibriumLineNode' )
    );

    // @public Initializes equilibrium line for second spring
    var secondSpringEquilibriumLineNode = new EquilibriumLineNode(
      this.modelViewTransform,
      model.springs[ 1 ],
      model.equilibriumPositionVisibleProperty,
      tandem.createTandem( 'secondSpringEquilibriumLineNode' )
    );

    // @public Initializes natural line for first spring
    var firstNaturalLengthLineNode = new NaturalLengthLineNode(
      this.modelViewTransform,
      model.springs[ 0 ],
      model.naturalLengthVisibleProperty,
      tandem.createTandem( 'firstNaturalLengthLineNode' )
    );

    // @public Initializes natural line for second spring
    var secondNaturalLengthLineNode = new NaturalLengthLineNode(
      this.modelViewTransform,
      model.springs[ 1 ],
      model.naturalLengthVisibleProperty,
      tandem.createTandem( 'secondNaturalLengthLineNode' )
    );

    this.gravityAndFrictionControlPanel.options.frictionVisibleProperty.set( false );
    this.springHangerNode.centerX = 336;

    // Adding all of the nodes to the scene graph
    this.addChild( this.springHangerNode );

    // Adding Panels to scene graph
    this.addChild( this.firstSpringConstantControlPanel );
    this.addChild( this.secondSpringConstantControlPanel );
    this.addChild( this.indicatorVisibilityControlPanel );
    this.addChild( this.gravityAndFrictionControlPanel );
    this.addChild( this.toolboxPanel );

    // Adding Buttons to scene graph
    this.addChild( this.resetAllButton );
    this.addChild( this.timeControlPanel );
    this.addChild( this.speedControl );
    this.addChild( this.firstSpringStopperButtonNode );
    this.addChild( secondSpringStopperButtonNode );

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
      self.indicatorVisibilityControlPanel.right = visibleBounds.right - self.spacing;
      self.gravityAndFrictionControlPanel.right = visibleBounds.right - self.spacing;
      self.toolboxPanel.right = visibleBounds.right - self.spacing;
      self.resetAllButton.right = visibleBounds.right - self.spacing;
      self.speedControl.right = self.resetAllButton.left - self.spacing * 6;
      self.timeControlPanel.right = self.speedControl.left - self.spacing * 6;
      self.toolboxPanel.dragBounds = 3;
      self.timerNode.updateBounds( visibleBounds.withOffsets(
        self.timerNode.width / 2, self.timerNode.height / 2, -self.timerNode.width / 2, -self.timerNode.height / 2
      ) );
      self.rulerNode.updateBounds( visibleBounds.withOffsets(
        -self.rulerNode.width / 2, self.rulerNode.height / 2, self.rulerNode.width / 2, -self.rulerNode.height / 2
      ) );
      self.massNodes.forEach( function( massNode ) {
        massNode.movableDragHandler.dragBounds = self.modelViewTransform.viewToModelBounds( visibleBounds );

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